using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentVibe.Data;
using RentVibe.Models;
using RentVibe.Services;

namespace RentVibe.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly NotificationService _notifications;

    public AdminController(AppDbContext db, UserManager<ApplicationUser> userManager, NotificationService notifications)
    {
        _db = db;
        _userManager = userManager;
        _notifications = notifications;
    }

    // Task 3: Implement Landlord Account Approval Logic
    [HttpGet("landlords/pending")]
    public async Task<IActionResult> GetPendingLandlords()
    {
        // TODO: استرجاع قائمة أصحاب العقارات اللي حالتهم Pending
        return Ok("Pending landlords placeholder");
    }

    [HttpPost("landlords/{id}/approve")]
    public async Task<IActionResult> ApproveLandlord(string id)
    {
        // TODO: تغيير حالة الحساب لـ Approved وإرسال إشعار
        return Ok("Approve landlord placeholder");
    }

    // Task 3: Implement Property Approval Logic
    [HttpGet("properties/pending")]
    public async Task<IActionResult> GetPendingProperties()
    {
        // TODO: استرجاع العقارات اللي مستنية موافقة الأدمن
        return Ok("Pending properties placeholder");
    }

    [HttpPost("properties/{id}/approve")]
    public async Task<IActionResult> ApproveProperty(int id)
    {
        // TODO: تغيير حالة العقار لـ Approved وإرسال إشعار
        return Ok("Approve property placeholder");
    }
}