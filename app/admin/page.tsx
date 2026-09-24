import type { Metadata } from 'next';
import { AdminPanel } from '@/components/admin-panel';
import './admin.css';
export const metadata: Metadata = {title:'مدیریت محتوا',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function AdminPage(){return <AdminPanel/>;}
