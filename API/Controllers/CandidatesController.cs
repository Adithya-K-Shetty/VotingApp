using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class CandidatesController : BaseApiController
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IPhotoService _photoService;

        public CandidatesController(ICandidateRepository candidateRepository,IMapper mapper,IUserRepository userRepository,DataContext context,IPhotoService photoService)
        {
            _photoService = photoService;
            _context = context;
            _userRepository = userRepository;
            _mapper = mapper;
            _candidateRepository = candidateRepository;
            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateDto>>> GetCandidates([FromQuery]CandidateParams candidateParams)
        {
            var candidates = await _candidateRepository.GetCandidatesAsync(candidateParams);
            return Ok(candidates);
        }

        [HttpGet("get-all-candidates")]
        public async Task<ActionResult<IEnumerable<CandidateDto>>> GetAllCandidates(){
            var allCandidates = await _candidateRepository.GetAllCandidatesAsync();
            return Ok(allCandidates); 
        }

        [HttpGet("get-all-winners")]
        public async Task<ActionResult<IEnumerable<CandidateDto>>> GetAllWinners(){
            var allwinners = await _candidateRepository.GetAllWinners();
            return Ok(allwinners);
        }


        [HttpPost("add-candidate")]
        public async Task<ActionResult<CandidateDto>> AddCandidate([FromForm] IFormFile file,[FromForm] CandidateRegisterDto candidateRegisterDto){
                 var candidate = await _candidateRepository.GetCandidateByRegionPartyAsync(candidateRegisterDto.RegionCode,candidateRegisterDto.PartyName);

                 if(candidate != null) return BadRequest("Candidate Already Present");

                  var new_candidate = _mapper.Map<CandidateData>(candidateRegisterDto);
                   _context.Candidates.Add(new_candidate);
                   if( await _context.SaveChangesAsync() > 0)
                    {
                        var candidateData = await _context.Candidates
                        .Include(p => p.Photos)
                        .SingleOrDefaultAsync(x => x.RegionCode == candidateRegisterDto.RegionCode && x.PartyName == candidateRegisterDto.PartyName);

                        if(candidateData == null)
                         return NotFound();

                         var result = await _photoService.AddPhotoAsync(file);
                         if (result.Error != null)
                                return BadRequest(result.Error.Message);

                         var photo = new Photo{
                                    Url = result.SecureUrl.AbsoluteUri,
                                    PublicId = result.PublicId
                                };

                        candidateData.Photos.Add(photo);

                        if(await _context.SaveChangesAsync() > 0)
                        {
                            return Ok( new CandidateDto
                            {
                                CandidateName = candidateData.CandidateName,
                                PhotoUrl = candidateData.Photos.FirstOrDefault().Url,
                                PartyName = candidateData.PartyName,
                                RegionCode = candidateData.RegionCode,
                                VoteCount = candidateData.VoteCount,
                                District = candidateData.District,
                                GramPanchayat = candidateData.GramPanchayat
                            });
                        }
                         return Ok( new CandidateDto
                            {
                                CandidateName = candidateData.CandidateName,
                                PhotoUrl = candidateData.Photos.FirstOrDefault().Url,
                                PartyName = candidateData.PartyName,
                                RegionCode = candidateData.RegionCode,
                                VoteCount = candidateData.VoteCount,
                                District = candidateData.District,
                                GramPanchayat = candidateData.GramPanchayat
                            });
             }
                 return BadRequest("Problem In Casting Vote");

        }




        [HttpPut("cast-vote")]

        public async Task<ActionResult> CastVote(CasteVoteDto casteVoteDto)
        {
            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());
            var candidate = await _candidateRepository.GetCandidateByRegionPartyAsync(casteVoteDto.RegionCode,casteVoteDto.PartyName);

            if(candidate == null) return NotFound();

            if(user.HasVoted) return BadRequest("Already Voted");

           candidate.VoteCount += 1;

           user.HasVoted = false;

            if(await _candidateRepository.SaveAllAsync()) 
            {
                if(await _userRepository.SaveAllAsync())
                {
                     return NoContent();
                }
                return NoContent();
               
            }
            return BadRequest("Problem In Casting Vote");
        }

        [HttpDelete("remove-candidate")]
        public async Task<ActionResult> RemoveCandidate(CasteVoteDto casteVoteDto)
        {
            var candidate = await _candidateRepository.GetCandidateByRegionPartyAsync(casteVoteDto.RegionCode,casteVoteDto.PartyName);
            if(candidate == null) return NotFound();
            else
                _candidateRepository.DeleteCandidate(candidate);

            if(await _candidateRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem Removing The Candidate");
        }

    }
}