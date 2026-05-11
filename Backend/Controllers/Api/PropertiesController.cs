using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentVibe.Data;
using RentVibe.DTOs;
using RentVibe.Models;
using RentVibe.Models.Enums;

namespace RentVibe.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public PropertiesController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // Task 1: Backend logic for Property posts - Create
    [HttpPost]
    [Authorize(Policy = "LandlordOnly")]
    public async Task<IActionResult> Create([FromBody] CreatePropertyDto dto)
    {
        // TODO: تنفيذ إضافة عقار جديد وربطه بالـ Landlord الحالي
        return Ok("Create logic placeholder");
    }

    // Task 1: Backend logic for Property posts - Update
    [HttpPut("{id:int}")]
    [Authorize(Policy = "LandlordOnly")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyDto dto)
    {
        // TODO: التأكد من ملكية العقار وتحديث بياناته
        return Ok("Update logic placeholder");
    }

    // Task 1: Backend logic for Property posts - Delete
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "LandlordOnly")]
    public async Task<IActionResult> Delete(int id)
    {
        // TODO: مسح العقار والصور المرتبطة به
        return Ok("Delete logic placeholder");
    }

    // Task 1: Backend logic for Property posts - Image Upload
    [HttpPost("{id:int}/images")]
    [Authorize(Policy = "LandlordOnly")]
    public async Task<IActionResult> UploadImages(int id, [FromForm] List<IFormFile> files)
    {
        // TODO: التعامل مع رفع الملفات وتخزينها في wwwroot
        return Ok("Upload images logic placeholder");
    }

    private static PropertyResponseDto MapToDto(Property p) 
    {
        // الـ Mapping Logic هيفضل هنا عشان يساعدك في عرض البيانات
        return new PropertyResponseDto { /* ... */ };
    }
}
