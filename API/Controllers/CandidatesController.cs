using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
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
        public CandidatesController(ICandidateRepository candidateRepository,IMapper mapper)
        {
            _mapper = mapper;
            _candidateRepository = candidateRepository;
            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateDto>>> GetCandidates([FromQuery]CandidateParams candidateParams)
        {
            var candidates = await _candidateRepository.GetCandidatesAsync(candidateParams);
            return Ok(candidates);
        }
    }
}