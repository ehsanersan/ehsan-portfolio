# راهنمای فایل‌های تصویری

همه تصاویر از فایل‌های ارسالی صاحب سایت انتخاب شده‌اند. نام‌های زیر صرفاً نام توصیفی فایل هستند؛ نام مشتری یا سفارش تجاری جدیدی به آن‌ها نسبت داده نشده است.

| فایل سایت | فایل ارسالی |
| --- | --- |
| hero.webp | تصویر پرتره نیم‌رخ سیاه‌وسفید با عینک |
| portrait.webp | DS907051.jpg |
| noir.webp | تصویر پرتره Low-key با سر رو به پایین |
| peanut.webp | Max_a_PEANUT_DREAM._“Ever.png |
| rice.webp | Max_a_Ultra-high-quality,_ (1).png |
| chicken.webp | تصویر مرغ کبابی روی زمینه بنفش |
| dolmeh.webp | Max_a_Create_a_3x3_grid_of.png |
| lentil.webp | Max_a_Create_a_premium_lux (3).png |
| kushka.webp | Max_a_Create_a_premium_lux (1).png |
| shrimp.webp | Max_a_Create_a_premium_lux.png |
| stew.webp | Max_a_Create_a_3×3_grid_in.png |
| writer.webp | Man_writing_at_desk_2K_202607291149.jpeg |

تبدیل اولیه به WebP و حذف metadata اضافی برای تحویل وب انجام شده است. فایل‌های اصلی در محل اولیه کاربر تغییر نکرده‌اند. `scripts/prepare-assets.mjs` فقط برای همان رایانه و مسیرهای اولیه است؛ برای اجرای پروژه یا تعویض محتوا به آن نیازی نیست. عکس جدید را در public/images بگذارید و build را اجرا کنید.

برای هر تصویر، متن جایگزین و دسته‌بندی در lib/content.ts قابل‌تغییر است. برای فایل‌های جدید نام لاتین کوچک با خط تیره انتخاب کنید تا image-loader.ts نسخه‌های مختلف را پیدا کند. اگر فرمت یا الگوی نام را تغییر دادید، loader را نیز هماهنگ کنید.

فونت: Vazirmatn از بسته @fontsource-variable/vazirmatn. مجوز فونت و متن مجوز در همان بسته npm موجود است. آیکون‌ها از lucide-react و علامت دیافراگم ساده سایت هستند.
