import type {ReactNode} from 'react';

export const metadata = {
  title: 'Range Slider',
  description: 'A simple range slider component built with React and Tailwind CSS',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}