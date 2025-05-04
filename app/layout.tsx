import '../styles/global.css';
import { ChatProvider } from '@/context/ChatContext';

export const metadata = {
  title: 'EX314 AI',
  description: 'A Biblical AI assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
