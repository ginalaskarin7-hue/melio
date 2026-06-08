import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Melio',
  keywords: [
  "Melio",
  "Melio Payments",
  "Melio login",
  "Melio sign in",
  "Melio account login",
  "Melio business login",
  "Melio payments login",
  "Melio customer portal",
  "Melio dashboard",
  "Melio app login",

  "meliopayments.com",
  "meliopayments login",
  "meliopayments sign in",
  "Melio account access",
  "Melio secure login",
  "Melio payment portal",

  "accounts payable",
  "accounts payable software",
  "AP automation",
  "accounts receivable",
  "AR software",
  "invoice management",
  "invoice payment platform",
  "bill pay software",
  "business bill pay",
  "online bill payment",

  "vendor payments",
  "pay vendors online",
  "vendor management",
  "supplier payments",
  "business payments",
  "B2B payments",
  "business payment platform",
  "small business payments",

  "cash flow management",
  "business cash flow",
  "payment automation",
  "payment workflows",
  "approval workflows",
  "payment scheduling",
  "recurring bill payments",
  "batch payments",

  "QuickBooks bill pay",
  "QuickBooks integration",
  "Xero integration",
  "NetSuite integration",
  "accounting software integration",
  "accounting automation",
  "bookkeeping software",

  "pay by ACH",
  "ACH payments",
  "bank transfer payments",
  "credit card vendor payments",
  "business credit card payments",
  "international vendor payments",
  "global business payments",
  "wire transfers",

  "invoice capture",
  "AI invoice processing",
  "automated invoice entry",
  "invoice approval workflow",
  "digital invoicing",
  "online invoicing",

  "small business accounting",
  "small business finance",
  "accounts payable solution",
  "accounts receivable solution",
  "finance operations",
  "business expense management",

  "Melio customer service",
  "Melio support",
  "Melio help center",
  "Melio password reset",
  "Melio account recovery",
  "forgot Melio password",
  "Melio mobile app",

  "how to pay vendors online",
  "how to automate accounts payable",
  "how to send ACH payments",
  "how to manage business invoices",
  "how to improve cash flow",
  "how to schedule business payments",
  "how to pay international vendors"
],
  description: 'Melio Web App',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
