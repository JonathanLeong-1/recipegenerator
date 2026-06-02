/**
 * Recipe Language Learning Model
 * A standalone script for training and generating recipes based on learned patterns
 */

let defaultRecipeTrainingData = [];

if (typeof require === 'function') {
  try {
    ({ recipeTrainingData: defaultRecipeTrainingData } = require('./recipeTrainingData'));
  } catch (error) {
    defaultRecipeTrainingData = [];
  }
}

class RecipeLanguageModel {
  constructor(order = 2) {
    this.order = order; // n-gram order
    this.ngramFrequency = {}; // stores frequency of n-gram sequences
    this.vocabulary = new Set();
    this.totalTokens = 0;
    this.recipes = []; // stores trained recipes
    this.ingredientPatterns = {}; // maps ingredients to common recipe elements
  }

  /**
   * Tokenize input text into words
   */
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  /**
   * Train on recipe data
   */
  trainOnRecipes(recipeArray) {
    this.ngramFrequency = {};
    this.vocabulary = new Set();
    this.totalTokens = 0;
    this.recipes = recipeArray;
    this.ingredientPatterns = {};

    // Extract and train on recipe text
    recipeArray.forEach((recipe) => {
      // Format: "recipe [name] uses [ingredient1] [ingredient2] method [notes]"
      const recipeText = `recipe ${recipe.name.toLowerCase()} uses ${recipe.ingredients
        .join(' ')
        .toLowerCase()} method ${recipe.notes.toLowerCase()}`;

      this.train(recipeText);

      // Build ingredient patterns
      recipe.ingredients.forEach((ingredient) => {
        const key = ingredient.toLowerCase();
        if (!this.ingredientPatterns[key]) {
          this.ingredientPatterns[key] = {
            recipes: [],
            commonPairs: {},
          };
        }
        this.ingredientPatterns[key].recipes.push(recipe.name);

        // Track ingredient co-occurrences
        recipe.ingredients.forEach((otherIngredient) => {
          if (ingredient !== otherIngredient) {
            const pairKey = otherIngredient.toLowerCase();
            this.ingredientPatterns[key].commonPairs[pairKey] =
              (this.ingredientPatterns[key].commonPairs[pairKey] || 0) + 1;
          }
        });
      });
    });
  }

  /**
   * Train the model on provided text data
   */
  train(text) {
    const tokens = this.tokenize(text);
    
    // Add start token
    const paddedTokens = Array(this.order - 1).fill('<START>').concat(tokens, ['<END>']);
    
    // Update vocabulary
    paddedTokens.forEach(token => this.vocabulary.add(token));
    this.totalTokens += tokens.length;

    // Build n-grams and their frequencies
    for (let i = 0; i < paddedTokens.length - this.order; i++) {
      const ngram = paddedTokens.slice(i, i + this.order);
      const context = ngram.slice(0, -1).join(' ');
      const nextToken = ngram[ngram.length - 1];

      if (!this.ngramFrequency[context]) {
        this.ngramFrequency[context] = {};
      }

      this.ngramFrequency[context][nextToken] = 
        (this.ngramFrequency[context][nextToken] || 0) + 1;
    }
  }

  /**
   * Get probability distribution for next token given context
   */
  getNextTokenProbabilities(context) {
    const frequencies = this.ngramFrequency[context];
    
    if (!frequencies) {
      // Return uniform distribution over vocabulary if context not found
      const uniformProb = 1 / this.vocabulary.size;
      const distribution = {};
      this.vocabulary.forEach(token => {
        distribution[token] = uniformProb;
      });
      return distribution;
    }

    // Calculate probabilities from frequencies
    const total = Object.values(frequencies).reduce((a, b) => a + b, 0);
    const probabilities = {};
    
    Object.entries(frequencies).forEach(([token, freq]) => {
      probabilities[token] = freq / total;
    });

    return probabilities;
  }

  /**
   * Select next token based on probability distribution
   */
  sampleFromDistribution(distribution, temperature = 1.0) {
    const tokens = Object.keys(distribution);
    
    if (tokens.length === 0) {
      return '<END>';
    }

    // Apply temperature to adjust randomness
    const adjustedProbs = {};
    let sum = 0;

    tokens.forEach(token => {
      const prob = distribution[token];
      const adjustedProb = Math.pow(prob, 1 / temperature);
      adjustedProbs[token] = adjustedProb;
      sum += adjustedProb;
    });

    // Normalize probabilities
    tokens.forEach(token => {
      adjustedProbs[token] /= sum;
    });

    // Sample using roulette wheel selection
    let random = Math.random();
    for (const token of tokens) {
      random -= adjustedProbs[token];
      if (random <= 0) {
        return token;
      }
    }

    return tokens[tokens.length - 1];
  }

  /**
   * Generate a recipe based on input ingredients
   */
  generateRecipe(inputIngredients, temperature = 0.9) {
    if (inputIngredients.length === 0) {
      return this.generate(50, temperature);
    }

    // Find similar recipes from training data
    const normalizedInput = inputIngredients.map(ing => ing.toLowerCase());
    let matchedRecipe = null;
    let maxOverlap = 0;

    this.recipes.forEach((recipe) => {
      const recipeIngs = recipe.ingredients.map(ing => ing.toLowerCase());
      const overlap = normalizedInput.filter(ing => 
        recipeIngs.some(recIng => recIng.includes(ing) || ing.includes(recIng))
      ).length;

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        matchedRecipe = recipe;
      }
    });

    if (matchedRecipe) {
      return `Recipe inspired by ${matchedRecipe.name}:\nIngredients: ${matchedRecipe.ingredients.join(', ')}\nMethod: ${matchedRecipe.notes}`;
    }

    // Generate new recipe description
    const ingredientText = normalizedInput.join(' ');
    let context = 'recipe uses ' + ingredientText;
    const generated = [];

    for (let i = 0; i < 30; i++) {
      const probabilities = this.getNextTokenProbabilities(context);
      const nextToken = this.sampleFromDistribution(probabilities, temperature);

      if (nextToken === '<END>' || nextToken === 'recipe') {
        break;
      }

      generated.push(nextToken);

      const tokens = context.split(' ');
      tokens.push(nextToken);
      context = tokens.slice(-(this.order - 1)).join(' ');
    }

    return `Generated recipe using ${inputIngredients.join(', ')}: ${generated.join(' ')}`;
  }

  /**
   * Get model statistics
   */
  getStats() {
    return {
      trainedRecipeCount: this.recipes.length,
      vocabularySize: this.vocabulary.size,
      totalTokens: this.totalTokens,
      ngramCount: Object.keys(this.ngramFrequency).length,
      order: this.order
    };
  }

  /**
   * Get model state as JSON (for saving/loading)
   */
  serialize() {
    return {
      order: this.order,
      ngramFrequency: this.ngramFrequency,
      vocabulary: Array.from(this.vocabulary),
      totalTokens: this.totalTokens
    };
  }

  /**
   * Load model state from JSON
   */
  deserialize(data) {
    this.order = data.order;
    this.ngramFrequency = data.ngramFrequency;
    this.vocabulary = new Set(data.vocabulary);
    this.totalTokens = data.totalTokens;
  }
}

// Example usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecipeLanguageModel;
}

// Standalone demo
if (require.main === module) {
  const model = new RecipeLanguageModel(2);

  console.log('Training recipe model...');
  model.trainOnRecipes(defaultRecipeTrainingData);

  console.log('\nModel Statistics:');
  console.log(model.getStats());

  console.log('\n--- Generate Recipe from Ingredients ---');
  const ingredients1 = ["egg", "spinach"];
  console.log(`Input: ${ingredients1.join(', ')}`);
  console.log(model.generateRecipe(ingredients1, 0.8));

  console.log('\nInput: ["beef", "cheese"]');
  console.log(model.generateRecipe(["beef", "cheese"], 0.8));

  console.log('\nInput: ["chicken", "broccoli"]');
  console.log(model.generateRecipe(["chicken", "broccoli"], 0.8));
}