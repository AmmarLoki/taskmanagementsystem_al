
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace TaskManagementSystem_AL_Backend_10Pearls.Utilities
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 16 bytes salt
        private const int KeySize = 32;  // 32 bytes hash
        private const int Iterations = 10000; // Number of iterations for PBKDF2

        /// <summary>
        /// Generates a salt and hashes the given password using PBKDF2.
        /// </summary>
        public static (string salt, string hash) HashPassword(string password)
        {
            // Generate a cryptographic random salt.
            byte[] saltBytes = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            string salt = Convert.ToBase64String(saltBytes);

            // Generate the hash.
            byte[] hashBytes = KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: Iterations,
                numBytesRequested: KeySize
            );
            string hash = Convert.ToBase64String(hashBytes);

            return (salt, hash);
        }

        /// <summary>
        /// Verifies a password against the stored salt and hash.
        /// </summary>
        public static bool VerifyPassword(string password, string storedSalt, string storedHash)
        {
            byte[] saltBytes = Convert.FromBase64String(storedSalt);
            byte[] computedHashBytes = KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: Iterations,
                numBytesRequested: KeySize
            );
            string computedHash = Convert.ToBase64String(computedHashBytes);

            // Compare the computed hash with the stored hash securely.
            return CryptographicOperations.FixedTimeEquals(
                Convert.FromBase64String(storedHash),
                Convert.FromBase64String(computedHash)
            );
        }
    }
}
