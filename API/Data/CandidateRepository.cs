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
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

        // public async Task<ActionResult<CandidateDto>> AddCandidate(IFormFile file, CandidateRegisterDto candidateRegisterDto)
        // {
        //    var new_candidate = _mapper.Map<CandidateData>(candidateRegisterDto);
        //    _context.Candidates.Add(new_candidate);

        //     if( await _context.SaveChangesAsync() > 0)
        //     {
        //         var candidate = await _context.Candidates
        //      .Include(p => p.Photos)
        //     .SingleOrDefaultAsync(x => x.RegionCode == candidateRegisterDto.RegionCode && x.PartyName == candidateRegisterDto.PartyName);

             

        //     }
        // }

        // public async Task<IEnumerable<CandidateDto>> GetAllCandidatesAsync()
        // {
        //     return await _context.Candidates.ProjectTo<CandidateDto>(_mapper.ConfigurationProvider).ToListAsync();
        // }

        public async Task<IEnumerable<CandidateDto>> GetAllWinners()
        {

               var query = _context.Candidates
        .GroupBy(c => c.RegionCode)
        .Select(g => new
        {
            RegionCode = g.Key,
            MaxVoteCount = g.Max(c => c.VoteCount),
            Candidates = g.Where(c => c.VoteCount == g.Max(c => c.VoteCount))
                .Select(c => new CandidateDto
                {
                    CandidateName = c.CandidateName,
                    PhotoUrl =  c.Photos.FirstOrDefault().Url,
                    PartyName = c.PartyName,
                    RegionCode = c.RegionCode,
                    VoteCount = c.VoteCount,
                    District = c.District,
                    GramPanchayat = c.GramPanchayat
                })
        });

    var winners = await query.ToListAsync();
    return winners.SelectMany(w => w.Candidates);

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

        public void DeleteCandidate(CandidateData candidateData)
        {
            _context.Candidates.Remove(candidateData);
        }

        public async Task<PagedList<CandidateDto>> GetAllCandidatesAsync(UserParams userParams)
        {
            var query = _context.Candidates.AsQueryable();
            return await PagedList<CandidateDto>.CreateAsync(query.AsNoTracking().ProjectTo<CandidateDto>(_mapper.ConfigurationProvider),userParams.PageNumber,userParams.PageSize);

        }
    }
}