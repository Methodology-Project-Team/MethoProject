using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RentVibe.DTOs;
using RentVibe.Models;

namespace RentVibe.Controllers.Api;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(
        UserManager<ApplicationUser> userManager, 
        SignInManager<ApplicationUser> signInManager, 
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }

    // Task 1: MT-23 - Implement User Registration
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // TODO: تنفيذ عملية التسجيل، التحقق من الأدوار، وحفظ المستخدم
        return Ok("Register endpoint placeholder");
    }

    // Task 1: MT-23 - Implement Login with JWT
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // TODO: التحقق من الهوية وتوليد توكن JWT
        return Ok("Login endpoint placeholder");
    }

    // Task 1: MT-25 - Get Current User Data
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Me()
    {
        // TODO: استرجاع بيانات المستخدم الحالي من التوكن
        return Ok("Me endpoint placeholder");
    }

    private string GenerateToken(ApplicationUser user)
    {
        // TODO: بناء الـ JWT Token Claims والتوقيع (Signing)
        return "token_placeholder";
    }
}