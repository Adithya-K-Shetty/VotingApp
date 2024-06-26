using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using System.Net.Mail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API.Controllers
{
    // [Authorize]
    public class UsersController : BaseApiController //Inheritence
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        private readonly IPhotoService _photoService;
        
        public UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService)  // dependency injection
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
            
        }
        

        [HttpGet]
        //[FromQuery] is used to provide a hint for the
        //API to look for the query parameters
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            
            userParams.CurrentUsername = currentUser.UserName;

            var users = await _userRepository.GetMembersAsync(userParams);

            //sending pagination response 
            //via the response header
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));
            //mapping of returened users and dto takes place
           
            return Ok(users);
        }

         [HttpGet("get-all-users")]
         public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers(){
            var allCandidates = await _userRepository.GetAllUsersAsync();
            return Ok(allCandidates); 
        }
        //  public async Task<ActionResult<IEnumerable<AppUser>>> GetAllUsers(){
        //     var allUsers = await _userRepository.GetUsersAsync();
        //     return Ok(allUsers); 
        // }


        [HttpGet("{username}")]
        public async Task<ActionResult<UserDto>> GetUser(string username)
        {
           return await _userRepository.GetUserAsync(username);
            
        }

        [HttpPut("allow-user")]
        public async Task<ActionResult<UserDto>> AllowUser(UserUpdateDto userUpdateDto)
        {
            var allowedUser = await _userRepository.GetUserForApproveAsync(userUpdateDto.Username,userUpdateDto.VoterIdNumber);
            //if(allowedUser.LoginAllowed) return BadRequest("Authenticated User");

            allowedUser.LoginAllowed = !allowedUser.LoginAllowed;
            

            //testing email sending
            if(allowedUser.LoginAllowed)
            {
                var emailSubject = "Login Allowed";
                var emailBody = "Your login has been allowed.";
                var userEmail = allowedUser.UserEmailId;
                try{
                    using(var smtpClient = new SmtpClient())
                    {
                        smtpClient.Host="smtp.elasticemail.com";
                        smtpClient.Port = 2525;
                        smtpClient.EnableSsl = true;
                        smtpClient.UseDefaultCredentials = false;
                        smtpClient.Credentials = new NetworkCredential("adithyakshettyshetty682@gmail.com", "32A11ED9D70BDF3945183EC537E0C6243269");
                        var message = new MailMessage("adithyakshettyshetty682@gmail.com", userEmail, emailSubject, emailBody);
                        await smtpClient.SendMailAsync(message);
                    }
                }
                catch (Exception ex)
                {
           
                    return BadRequest("Failed to send email: " + ex.Message);
                }
            }
            //end of email sending

            if(await _userRepository.SaveAllAsync()) return Ok(_mapper.Map<UserDto>(allowedUser)); //http status code 204 which says everything is ok but nothing to return

            return BadRequest("Failed To Authenticate User");


        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();
            //When we retrieve the user the entity frame work starts tracking that particular user
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if(user == null) return NotFound();

            _mapper.Map(memberUpdateDto,user);

            if(await _userRepository.SaveAllAsync()) return NoContent(); //http status code 204 which says everything is ok but nothing to return

            return BadRequest("Failed To Update User");
        }

        // [HttpPut("add-document")]
        // public async Task<ActionResult<PhotoDto>> AddDocument(IFormFile file)
        // {
        //     //entity frame work tracks the user
        //     // var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        //      var user = await _userRepository.GetUserByIdAsync(User.GetUserId());
        //     if(user == null) return NotFound();

        //     var result = await _photoService.AddPhotoAsync(file);

        //     if(result.Error != null) return BadRequest(result.Error.Message);

        //     var document = new Document{
        //         Url = result.SecureUrl.AbsoluteUri,
        //         PublicId = result.PublicId
        //     };

            

        //     //tracks the user in memory
        //     user.Documents.Add(document);

        //     if(await _userRepository.SaveAllAsync())
        //     {
        //         //returns 201 created response
        //         //along with location detail about where to find the newly created resource
        //         //first parameter :- client will be redirected to the GetUser Method
        //         //second parameter :- represents route values that will be used to construct the URL of the action method 
        //         //third parameter :- represent the data returned in response body
        //         return CreatedAtAction(nameof(GetUser),new {username = user.UserName},_mapper.Map<PhotoDto>(document));
        //     }

        //     return BadRequest("Problem Adding Photo");
        // }

[HttpPut("add-document")]
public async Task<ActionResult<PhotoDto>> AddDocument(IFormFile file)
{
    var user = await _userRepository.GetUserByIdAsync(User.GetUserId());
    if (user == null)
        return NotFound();

    var result = await _photoService.AddPhotoAsync(file);

    if (result.Error != null)
        return BadRequest(result.Error.Message);

    var existingDocument = user.Documents.FirstOrDefault(x=>x.AppUserId == user.Id);
    if (existingDocument != null)
    {
        // Update the existing document
        existingDocument.Url = result.SecureUrl.AbsoluteUri;
        existingDocument.PublicId = result.PublicId;
    }
    else
    {
        // Create a new document
        var document = new Document
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        user.Documents.Add(document);
    }

    if (await _userRepository.SaveAllAsync())
    {
        return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(user.Documents.FirstOrDefault()));
    }

    return BadRequest("Problem Adding Photo");
}

        /*[HttpPut("set-main-photo/{photoId}")]

        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo == null)  return NotFound();

            //checking whether the photo passed is already a main photo
            if(photo.IsMain) return BadRequest("this is already your main photo");
            
            //if the above condition fails
            //get the current main photo 
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if(currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem Setting Main Photo");

        }*/

        /*[HttpDelete("delete-photo/{photoId}")]

        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());  

            var photo = user.Photos.FirstOrDefault(x=>x.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("U cannot delete your main photo");

            if(photo.PublicId != null)
            {
                var result = await _photoService.DeletionResultAsync(photo.PublicId);

                if(result.Error != null) return BadRequest(result.Error.Message);

            }
            //removing data from the database
            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem Deleting Photo");
        }*/
    }
}