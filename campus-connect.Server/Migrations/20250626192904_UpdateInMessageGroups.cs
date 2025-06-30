using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace campus_connect.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInMessageGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "MessageGroups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByRole",
                table: "MessageGroups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "MessageGroups",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "MessageGroups",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "MessageGroups");

            migrationBuilder.DropColumn(
                name: "CreatedByRole",
                table: "MessageGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "MessageGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "MessageGroups");
        }
    }
}
