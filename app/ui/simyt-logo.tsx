import { DocumentIcon } from '../../node_modules/outline';
import { lusitana } from './fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <DocumentIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Simyt Soacha</p>
    </div>
  );
}