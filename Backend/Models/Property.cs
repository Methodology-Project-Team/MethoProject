using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RentVibe.Models.Enums;

namespace RentVibe.Models;

public class Property
{
    public int Id { get; set; }

    [Required]
    public string LandlordId { get; set; } = string.Empty;

    [ForeignKey(nameof(LandlordId))]
    public ApplicationUser Landlord { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    public decimal Price { get; set; }

    [Required]
    [MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    public PropertyType PropertyType { get; set; } = PropertyType.Apartment;

    // Amenities
    public bool HasParking { get; set; }
    public bool HasElevator { get; set; }
    public bool IsFurnished { get; set; }

    public RentalStatus RentalStatus { get; set; } = RentalStatus.Available;
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pending;

    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public double AreaSqFt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
}