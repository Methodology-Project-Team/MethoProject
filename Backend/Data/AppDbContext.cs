using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RentVibe.Models;
using RentVibe.Models.Enums;

namespace RentVibe.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ----- Property -----
        modelBuilder.Entity<Property>(entity =>
        {
            entity.Property(p => p.Price).HasColumnType("decimal(18,2)");

            entity.HasOne(p => p.Landlord)
                  .WithMany(u => u.Properties)
                  .HasForeignKey(p => p.LandlordId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(p => p.ApprovalStatus);
            entity.HasIndex(p => p.RentalStatus);
            entity.HasIndex(p => p.Location);
        });

        // ----- PropertyImage -----
        modelBuilder.Entity<PropertyImage>(entity =>
        {
            entity.HasOne(pi => pi.Property)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });



        
        // ----- Seed roles (ConcurrencyStamp must be static to avoid model changes between builds) -----
        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "role-admin",    Name = "Admin",    NormalizedName = "ADMIN",    ConcurrencyStamp = "stamp-admin" },
            new IdentityRole { Id = "role-landlord", Name = "Landlord", NormalizedName = "LANDLORD", ConcurrencyStamp = "stamp-landlord" },
            new IdentityRole { Id = "role-tenant",   Name = "Tenant",   NormalizedName = "TENANT",   ConcurrencyStamp = "stamp-tenant" }
        );

        // ----- Seed admin user -----
        var adminId = "admin-user-id";
        var adminUser = new ApplicationUser
        {
            Id = adminId,
            UserName = "admin@rentvibe.com",
            NormalizedUserName = "ADMIN@RENTVIBE.COM",
            Email = "admin@rentvibe.com",
            NormalizedEmail = "ADMIN@RENTVIBE.COM",
            EmailConfirmed = true,
            FullName = "System Admin",
            Role = UserRole.Admin,
            AccountStatus = AccountStatus.Approved,
            SecurityStamp = "STATIC-SECURITY-STAMP",
            ConcurrencyStamp = "STATIC-CONCURRENCY-STAMP",
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            // Pre-computed hash for "Admin@123"
            PasswordHash = "AQAAAAIAAYagAAAAEMNUmxzgRfC6v08KqKzYSSAkBpywkUtQlbjR/b/v9tUNqpqOqL+SZWeTNoOc6OlwHg=="
        };
        modelBuilder.Entity<ApplicationUser>().HasData(adminUser);

        // Assign Admin role
        modelBuilder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string> { UserId = adminId, RoleId = "role-admin" }
        );
    }
}
