import Header from '../components/Header.tsx';

const AddressPage = () => {
  const address = window.location.search.split('=')[1];

  return (
    <>
     <Header hasSearchBar />
     <h1>{address}</h1>
    </>
  );
};

export default AddressPage;