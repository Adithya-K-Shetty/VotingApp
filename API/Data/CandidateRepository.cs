using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CandidateRepository(DataContext context,IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }

        public async Task<IEnumerable<CandidateData>> GetAllCandidatesAsync()
        {
            return await _context.Candidates.ToListAsync();
        }

        public async Task<CandidateData> GetCandidateByRegionPartyAsync(string regioncode, string partyname)
        {
           return await _context.Candidates.SingleOrDefaultAsync(x => x.RegionCode == regioncode && x.PartyName == partyname);
        }

        public async Task<IEnumerable<CandidateDto>> GetCandidatesAsync(CandidateParams candidateParams)
        {
            var query = _context.Candidates.AsQueryable();
            query = query.Where(c => c.District == candidateParams.District && c.GramPanchayat == candidateParams.GramPanchayat);

            return await query.ProjectTo<CandidateDto>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
             return await _context.SaveChangesAsync() > 0;
        }
    }
}