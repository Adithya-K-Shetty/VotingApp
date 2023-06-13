using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;

namespace API.interfaces
{
    public interface ICandidateRepository
    {
        Task<bool> SaveAllAsync();
        Task<IEnumerable<CandidateDto>> GetCandidatesAsync(CandidateParams candidateParams);
    }
}