import { Button } from '@geist-ui/core';

import { Layout } from '@/components/layout';
import { useBreadCrumb } from '@/hooks/use-bread-crumb';

export const CompanyIndex = () => {
  const [, setBreadCrumb] = useBreadCrumb();

  const bc = [{ label: 't', id: 't' }];

  return (
    <>
      <Layout name='asd'>
        <h1>company index</h1>
        <Button onClick={() => setBreadCrumb(bc)}>addBc</Button>
      </Layout>
    </>
  );
};
