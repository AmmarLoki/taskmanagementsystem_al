using TaskManagementSystem_AL_Backend_10Pearls.Utilities; // Import your PasswordHasher
using System;

public class PasswordGenerationHelper
{
    public static void Main()
    {
        // Generate salt and hash for the password 'admin'
        var (salt, hash) = PasswordHasher.HashPassword("admin");

        // Output to console (you can copy this output to use in your seed data)
        Console.WriteLine($"Salt: {salt}");
        Console.WriteLine($"Hash: {hash}");
    }
}
