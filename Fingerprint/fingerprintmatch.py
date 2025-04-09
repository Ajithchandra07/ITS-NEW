from fingerprintmatcher import fingerprintMatcher

# Create an instance of the FingerprintMatcher class
fingerprint_matcher = fingerprintMatcher()

# Paths to the fingerprint images
image1_path = r"C:\Users\user\Desktop\Fingerprint\1.png"
image2_path = r"C:\Users\user\Desktop\Fingerprint\222.png"

# Match the two fingerprint images
match_result = fingerprint_matcher.match_fingerprints(image1_path, image2_path)

# Check if the fingerprints matchyum'
if match_result:
    print("Fingerprints match: OK")
else:
    print("Fingerprints do not match")