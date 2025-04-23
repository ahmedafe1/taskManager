import { ClientProviders } from '@/components/providers/ClientProviders';
import './globals.css';

export const metadata = {
    title: 'Task Management System',
    description: 'A simple task management system built with Next.js and ASP.NET Core',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
