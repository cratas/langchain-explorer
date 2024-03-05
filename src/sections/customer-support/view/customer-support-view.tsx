import { endpoints } from '@/app/api/endpoints';

// TODO: add into view (about use case)
export const CustomerSupportView = () => {
  const fetchCustomerSupport = async () => {
    const data = await fetch(endpoints.customerSupport);
    const json = await data.json();

    console.log('data', json);
  };

  return (
    <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
      <button onClick={fetchCustomerSupport} type="button">
        test
      </button>
    </div>
  );
};
