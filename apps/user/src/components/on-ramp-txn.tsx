import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';

type StatusType = 'Success' | 'Failure' | 'Processing';

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: StatusType;
    provider: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title='Recent Transactions'>
        <CardHeader>Recent Transactions</CardHeader>
        <div className='text-center pb-8 pt-8'>No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='pt-2'>
          {transactions.map((t) => (
            <Card className='p-3'>
              <CardContent className='flex '>
                <div className='text-lg'>Received</div>
                <Badge
                  className='ml-4 justify-start'
                  variant={
                    t.status === 'Success'
                      ? 'default'
                      : t.status === 'Failure'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {t.status}
                </Badge>
                <div className=' ml-auto '>+ ₹ {t.amount / 100}</div>
              </CardContent>
              <div className='ml-5 text-slate-600 text-md'>
                {t.time.toDateString()}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
