using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace campus_connect.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovedByCollegeId",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedOn",
                table: "Students",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedByCollegeId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ApprovedOn",
                table: "Students");
        }
    }
}
