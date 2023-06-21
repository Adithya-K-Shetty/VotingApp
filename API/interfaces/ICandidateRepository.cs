using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.interfaces
{
    public interface ICandidateRepository
    {
        Task<bool> SaveAllAsync();
        Task<IEnumerable<CandidateDto>> GetCandidatesAsync(CandidateParams candidateParams);

        Task<CandidateData> GetCandidateByRegionPartyAsync(string regioncode,string partyname);

        Task<IEnumerable<CandidateDto>> GetAllCandidatesAsync();

         Task<IEnumerable<CandidateDto>> GetAllWinners();

         void DeleteCandidate(CandidateData candidateData);

         //Task<ActionResult<CandidateDto>> AddCandidate(IFormFile file,CandidateRegisterDto candidateRegisterDto);
    }
}