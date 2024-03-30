import { SendCard } from '../../../components/send-card';

export default function () {
  return (
    <div className='w-full m-4'>
      <div className='text-4xl dark:text-gray-300 pt-8 ml-4 mb-8 font-bold'>
        Peer-Peer Transfer
      </div>
      <SendCard />
    </div>
  );
}
