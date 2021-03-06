package com.ssafy.cobook.service.dto.user;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor

public class UserFollowResDto {
    private Long userId;
    private String nickName;

    public UserFollowResDto(Long userId, String nickName){
        this.userId = userId;
        this.nickName = nickName;
    }
}
