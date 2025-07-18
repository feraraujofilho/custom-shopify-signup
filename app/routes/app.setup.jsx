import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Check if the metafield definition already exists
    const checkDefinition = await admin.graphql(
      `#graphql
      query checkMetafieldDefinition {
        metafieldDefinitions(first: 10, namespace: "custom", ownerType: CUSTOMER) {
          edges {
            node {
              id
              namespace
              key
            }
          }
        }
      }`,
    );

    const checkResponse = await checkDefinition.json();
    const definitions = checkResponse.data.metafieldDefinitions.edges;

    // Check if our reseller definition already exists
    const resellerDefinitionExists = definitions.some(
      (edge) => edge.node.key === "reseller",
    );

    if (!resellerDefinitionExists) {
      // Create the metafield definition
      const createDefinition = await admin.graphql(
        `#graphql
        mutation createResellerMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
              namespace
              key
              type {
                name
              }
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
        {
          variables: {
            definition: {
              name: "Reseller",
              namespace: "custom",
              key: "reseller",
              description: "The reseller who referred this customer",
              type: "single_line_text_field",
              ownerType: "CUSTOMER",
              pin: true,
            },
          },
        },
      );

      const createResponse = await createDefinition.json();

      if (createResponse.data.metafieldDefinitionCreate.userErrors.length > 0) {
        console.error(
          "Error creating metafield definition:",
          createResponse.data.metafieldDefinitionCreate.userErrors,
        );
        return json({
          success: false,
          error: createResponse.data.metafieldDefinitionCreate.userErrors,
        });
      }

      return json({
        success: true,
        message: "Metafield definition created successfully",
        definition:
          createResponse.data.metafieldDefinitionCreate.createdDefinition,
      });
    }

    return json({
      success: true,
      message: "Metafield definition already exists",
    });
  } catch (error) {
    console.error("Error in setup:", error);
    return json({
      success: false,
      error: error.message,
    });
  }
};
