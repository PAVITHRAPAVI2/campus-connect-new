﻿namespace campus_connect.Server.Model.DTO
{
    public class VerifyOtpDto
    {

        public required string Email { get; set; }
        public required string Otp { get; set; }
    }

}
