// pages/index.js

import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Chart from '@/components/ui/Chart';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <CardHeader>
            <CardTitle>Line Chart - Multiple</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <span className="icon">▲</span>
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
