using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CandidatesController : BaseApiController
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        public CandidatesController(ICandidateRepository candidateRepository,IMapper mapper,IUserRepository userRepository)
        {
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

        [HttpPut("cast-vote")]

        public async Task<ActionResult> CastVote(CasteVoteDto casteVoteDto)
        {
            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());
            var candidate = await _candidateRepository.GetCandidateByRegionPartyAsync(casteVoteDto.RegionCode,casteVoteDto.PartyName);

            if(candidate == null) return NotFound();

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

    }
}