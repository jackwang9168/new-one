package com.example.springboot.mapper;

import com.example.springboot.entity.Rank;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RankMapper {

    @Insert("insert into `rank` (user_id, nums, wins, points) " +
            "values (#{user_id}, #{nums}, #{wins}, #{points})")
    void insert(Rank rank);

    @Delete("delete from `user` where id = #{id}")
    void delete(Integer id);

    @Select("select 'username','nums','wins','points' from `rank`,'user' where user.id = rank.user_id")
    List<Rank> selectTotalRank();

    @Update("update `rank` set user_id = #{user_id}, nums = #{nums}, " +
            "wins = #{wins}, points = #{points} where user_id = #{user_id}")
    void update(Rank rank);
}
