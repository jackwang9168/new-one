package com.example.springboot.controller;

import com.example.springboot.common.Result;
import com.example.springboot.entity.Rank;
import com.example.springboot.entity.User;
import com.example.springboot.service.RankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/rank")
public class RankController {

    @Autowired
    RankService rankService;

    //添加信息
    @PostMapping("/add")
    public Result add(@RequestBody Rank rank) {
        try {
            rankService.insertRank(rank);
        } catch (Exception e) {
            return Result.error("插入数据错误");
        }
        return Result.success();
    }

    //删除信息
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id) {
        rankService.deleteRank(id);
        return Result.success();
    }

    //查总榜
    @GetMapping("/selectAll")
    public Result selectAll() {
        List<Rank> ranks = rankService.selectTotalRank();
        return Result.success(ranks);
    }

    //更改信息
    @PutMapping("/update")
    public Result update(@RequestBody Rank rank) {
        rankService.updateRank(rank);
        return Result.success();
    }

}
