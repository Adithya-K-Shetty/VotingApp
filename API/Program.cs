using System.Text;
using API.Data;
using API.Entities;
using API.Extensions;
using API.interfaces;
using API.middleware;
using API.Services;
using API.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


//this builds the application by creating an instance of IApplication builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// adds the controllers and related services
//ontrollers are responsible for handling incoming HTTP requests 
//and returning appropriate responses
builder.Services.AddControllers();
//these service is extended
//and written in separate file
//parameter :-configuring and registering application-specific services 
//and dependencies using the provided configuration

//custom extension method
//some of the example configurations
//services like database contexts, repositories, logging providers, 
//third-party integrations
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

/* These are the middle wares and positionong matters*/

//deverloper exception page middleware
//outputs the exception into the console
//custom exception handling middle ware to handle all the exceptions
//dotnet 5 had a mode to check
//whether we are in dev mode
//errors in console that is stack trace is generated by this


//this is the cutom exception middle ware to handle all the exception
//centralized exception handling
//so any exception will be thrown up here
app.UseMiddleware<ExceptionMiddleware>();


//there is developer exceptio page here to provide more info about error
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));

app.UseAuthentication();  // should happen before mapping the controller

app.UseAuthorization();  // should happen before mapping the controller


//the appropriate controller and action method are executed when a matching request is received
app.MapControllers();

app.MapHub<PresenceHub>("hubs/presence"); //providing end point for the hub
app.MapHub<PresenceHub>("hubs/message");


//provides access to all of the services defined above
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
//this isnt a http request
//so we cannot handle this with the above defined
//exception middleware
try{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(context,userManager,roleManager);
}
catch(Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex,"An error occurred during migration");
}

//starts the request processing pipeline
app.Run();
