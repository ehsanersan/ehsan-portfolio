import data from "../content/site.json";
export type Work = {
  id: string;
  title: string;
  category: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  featured?: boolean;
  video?: string;
  before?: string;
  after?: string;
};

export const site = data.site;
export const nav = data.nav as [string,string][];
export const categories = data.categories;
export const works: Work[] = data.works;
export const services = data.services;
export const pricingCategories = data.pricingCategories;
export const plans = data.plans;
export const courses = data.courses;
export const faqs = data.faqs;
export const processSteps = data.processSteps;
export const testimonials = data.testimonials as {name:string;text:string;role:string}[];
export function whatsappUrl(message = site.whatsappMessage) { return `${site.whatsapp}?text=${encodeURIComponent(message)}`; }
export function copyText(key:string) { return (data.copy as Record<string,string>)[key] ?? ""; }
export function copyLink(key:string) { return (data.links as Record<string,string>)[key] ?? "/"; }
