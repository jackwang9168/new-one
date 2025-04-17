package com.example.springboot.service;

import com.example.springboot.entity.Rank;
import com.example.springboot.mapper.RankMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankService {

    @Autowired
    RankMapper rankMapper;

    public void insertRank(Rank rank) {
        rankMapper.insert(rank);
    }

    public void deleteRank(Integer id) {
        rankMapper.delete(id);
    }

    public List<Rank> selectTotalRank() {
        return rankMapper.selectTotalRank();
    }


    public void updateRank(Rank rank) {
        rankMapper.update(rank);
    }
}
