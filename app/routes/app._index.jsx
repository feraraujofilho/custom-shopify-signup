import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { Page, Layout, Text, Card, BlockStack, List } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const shopify = useAppBridge();
  const setupFetcher = useFetcher();

  // Run metafield definition setup on component mount
  useEffect(() => {
    if (setupFetcher.state === "idle" && !setupFetcher.data) {
      setupFetcher.load("/app/setup");
    }
  }, []);

  useEffect(() => {
    if (setupFetcher.data?.success) {
      console.log("Metafield definition setup:", setupFetcher.data.message);
      if (setupFetcher.data.definition) {
        shopify.toast.show(
          "Customer reseller metafield definition created successfully",
        );
      }
    } else if (setupFetcher.data?.error) {
      console.error(
        "Metafield definition setup error:",
        setupFetcher.data.error,
      );
      shopify.toast.show("Error setting up metafield definition", {
        isError: true,
      });
    }
  }, [setupFetcher.data, shopify]);

  return (
    <Page>
      <TitleBar title="Custom Signup App" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingMd">
                Welcome to Custom Signup App
              </Text>
              <Text variant="bodyMd" as="p">
                This app provides a custom signup form for your store that can
                be embedded in your theme.
              </Text>

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Features
                </Text>
                <List>
                  <List.Item>
                    Custom signup form that can be embedded in any page
                  </List.Item>
                  <List.Item>
                    Automatic reseller tracking via URL parameters (e.g.,
                    ?reseller=CARLOS)
                  </List.Item>
                  <List.Item>
                    Customer metafields for storing reseller information
                  </List.Item>
                  <List.Item>
                    Automatic redirect to login page after successful signup
                  </List.Item>
                </List>
              </BlockStack>

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  How to Use
                </Text>
                <List type="number">
                  <List.Item>
                    Add the signup form extension to your theme through the
                    theme editor
                  </List.Item>
                  <List.Item>
                    Configure the form title and other settings in the theme
                    editor
                  </List.Item>
                  <List.Item>
                    Share signup links with reseller parameters:{" "}
                    <code>yourstore.com/signup?reseller=NAME</code>
                  </List.Item>
                  <List.Item>
                    New customers will be created with the reseller information
                    stored as a metafield
                  </List.Item>
                </List>
              </BlockStack>

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Metafield Configuration
                </Text>
                <Text variant="bodyMd" as="p">
                  This app automatically creates a customer metafield
                  definition:
                </Text>
                <List>
                  <List.Item>
                    <strong>Namespace:</strong> custom
                  </List.Item>
                  <List.Item>
                    <strong>Key:</strong> reseller
                  </List.Item>
                  <List.Item>
                    <strong>Type:</strong> Single line text
                  </List.Item>
                  <List.Item>
                    <strong>Visibility:</strong> Pinned (visible in Shopify
                    admin)
                  </List.Item>
                </List>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
