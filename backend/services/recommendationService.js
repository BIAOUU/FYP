const UserInteraction = require('../models/userInteractionModel');
const Product = require('../models/productModel');
const User = require('../models/userModel'); // Import User model

// Helper function to determine age group
const getAgeGroup = (age) => {
  if (age < 21) return 'under_21';
  if (age >= 21 && age <= 30) return '21-30';
  if (age >= 31 && age <= 40) return '31-40';
  return 'over_40';
};

const getCollaborativeRecommendations = async (userId) => {
  try {
    console.log(`Fetching recommendations for user: ${userId}`);

    // Step 1: Get the user's profile to determine their age group
    const user = await User.findById(userId);
    if (!user || !user.profile.age) {
      console.log('User or age not found.');
      return []; // No recommendations if user or age is missing
    }
    const userAgeGroup = getAgeGroup(user.profile.age);
    console.log(`User's age group: ${userAgeGroup}`);

    // Step 2: Find products the current user interacted with
    const userInteractions = await UserInteraction.find({ userId });
    const interactedProductIds = userInteractions.map((i) => i.productId);
    console.log(`User interacted with products: ${interactedProductIds}`);

    // Step 3: Find users in the same age group
    const usersInSameAgeGroup = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      'profile.age': { $exists: true },
    }).then((users) =>
      users.filter((u) => getAgeGroup(u.profile.age) === userAgeGroup)
    );
    const similarUserIds = usersInSameAgeGroup.map((u) => u._id);
    console.log(`Found users in the same age group: ${similarUserIds}`);

    // Step 4: Find all products viewed by these similar users
    const similarUserInteractions = await UserInteraction.find({
      userId: { $in: similarUserIds },
    });

    // Collect product IDs from these users' interactions
    const similarUserProductIds = similarUserInteractions.map((i) => i.productId);
    console.log(`Products interacted by similar users: ${similarUserProductIds}`);

    // Combine both product sets: Viewed by similar users + Current user's interactions
    const combinedProductIds = [...new Set([...interactedProductIds, ...similarUserProductIds])];

    console.log(`Combined product recommendations (age + views): ${combinedProductIds}`);

    // Step 5: Fetch product details for the recommended products
    const recommendedProducts = await Product.find({ _id: { $in: combinedProductIds } });
    console.log(`Recommended products: ${JSON.stringify(recommendedProducts)}`);

    return recommendedProducts;
  } catch (error) {
    console.error('Error in collaborative recommendations:', error);
    return [];
  }
};

module.exports = { getCollaborativeRecommendations };
