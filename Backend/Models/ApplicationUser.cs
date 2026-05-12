
using Microsoft.AspNetCore.Identity;
using RentVibe.Models.Enums;

namespace RentVibe.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Tenant;

    public AccountStatus AccountStatus { get; set; } = AccountStatus.Approved;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    
    public ICollection<Property> Properties { get; set; } = new List<Property>();

}
