package com.example.springboot.mapper;

import com.example.springboot.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Insert("insert into `user` (username, password, phone, avatar) " +
            "values (#{username}, #{password}, #{phone}, #{avatar})")
    void insert(User user);


    @Delete("delete from `user` where id = #{id}")
    void delete(Integer id);


    @Select("select * from `user`")
    List<User> selectAll();

    @Select("select * from `user` where id = #{id}")
    User selectByUserId(Integer id);

    @Select("select * from `user` where username = #{username}")
    User selectByUsername(String username);

    @Select("select * from `user` where phone = #{phone}")
    User selectByPhone(String phone);

    @Update("update `user` set username = #{username}, " +
            "phone = #{phone}, avatar = #{avatar} where username = #{username}")
    void update(User user);

    @Update("update `user` set password = #{password} where username = #{username}")
    void updatepass(User user);
}
