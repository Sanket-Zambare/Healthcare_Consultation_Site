using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsultationSite.Migrations
{
    /// <inheritdoc />
    public partial class AddDegreeColumnToDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Degree",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Degree",
                table: "Doctor");
        }
    }
}
