/* eslint-disable prettier/prettier */
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

class user_github_insert_dto {
    @IsDefined()
    id: string;
    node_id: string;
    avatar_url: string;
    type: string;
    name: string;
    followers: number;
    following: number;
    bio: string;
    location: string;


    @IsDefined()
    @IsNotEmpty()
    email: string;
    @IsDefined()
    role: string;
}

export default user_github_insert_dto;