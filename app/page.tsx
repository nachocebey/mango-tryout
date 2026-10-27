import Link from 'next/link';

export default function Home() {
  return (
    <ul>
      <li><Link href="/exercise1">Exercise 1 - normal range</Link></li>
      <li><Link href="/exercise2">Exercise 2 - fixed values range</Link></li>
    </ul>
  );
}
