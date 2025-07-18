import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  // Verify the request is coming from your store
  const { admin, session } = await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return json({ success: false, message: "Method not allowed" }, 405);
  }

  try {
    const { email, firstName, lastName, reseller } = await request.json();

    // Validate input
    if (!email || !firstName || !lastName) {
      return json(
        {
          success: false,
          message: "All fields are required",
        },
        400,
      );
    }

    // Create customer using GraphQL mutation
    const response = await admin.graphql(
      `#graphql
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            email
            firstName
            lastName
            metafields(first: 5) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }`,
      {
        variables: {
          input: {
            email,
            firstName,
            lastName,
            metafields: reseller
              ? [
                  {
                    namespace: "custom",
                    key: "reseller",
                    value: reseller,
                    type: "single_line_text_field",
                  },
                ]
              : undefined,
          },
        },
      },
    );

    const data = await response.json();

    if (data.data.customerCreate.userErrors.length > 0) {
      const errors = data.data.customerCreate.userErrors;
      return json(
        {
          success: false,
          message: errors[0].message,
        },
        400,
      );
    }

    return json({
      success: true,
      customer: data.data.customerCreate.customer,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return json(
      {
        success: false,
        message: "An error occurred. Please try again.",
      },
      500,
    );
  }
};

// GET requests should return method not allowed
export const loader = async () => {
  return json({ error: "Method not allowed" }, 405);
};
