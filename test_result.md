# QARK v6 - Exploit APK (POC) Integration

## Original User Problem Statement
المستخدم طلب إصلاح جميع ملفات exploit_apk لجعلها تعمل في إنشاء POC (Proof of Concept)، مع إضافة خيار في الواجهة لبدء عملية البناء.

## Work Completed

### 1. تحديث ملفات Gradle لآخر إصدار مستقر ✅

تم تحديث الملفات التالية في `/app/backend/qark/exploit_apk/`:

#### `build.gradle` (Root level)
- تحديث Gradle plugin إلى `8.1.4` (من 1.1.0)
- إضافة `google()` repository
- استخدام `mavenCentral()`
- إضافة clean task

#### `app/build.gradle`
- تحديث `compileSdk` إلى 34 (من 21)
- تحديث `targetSdk` إلى 34
- تحديث `minSdk` إلى 21 (من 7)
- إضافة `namespace` للتوافق مع AGP 8+
- تحديث `compileOptions` لاستخدام Java 11
- تحديث dependencies:
  - `androidx.appcompat:appcompat:1.6.1`
  - `com.google.android.material:material:1.11.0`
  - `androidx.constraintlayout:constraintlayout:2.1.4`
  - `androidx.recyclerview:recyclerview:1.3.2`
- تغيير `compile` إلى `implementation`
- إضافة `viewBinding` support

#### `gradle/wrapper/gradle-wrapper.properties`
- تحديث Gradle wrapper إلى `8.2`

### 2. إضافة API Endpoints في Backend ✅

تم إضافة 4 endpoints جديدة في `/app/backend/server.py`:

1. **POST `/api/qark/scan/{scan_id}/build-poc`**
   - يبدأ عملية بناء POC APK
   - يعمل في الخلفية (background task)
   
2. **GET `/api/qark/scan/{scan_id}/poc-status`**
   - يحصل على حالة بناء POC
   - يعرض معلومات مثل `poc_built`, `poc_path`, `timestamp`
   
3. **GET `/api/qark/scan/{scan_id}/download-poc`**
   - تحميل POC APK المبني
   - نوع الملف: `application/vnd.android.package-archive`

### 3. تحديث QARK API Module ✅

تم تحديث `/app/backend/qark_api.py`:

#### إضافة وظائف جديدة:
- `build_poc(scan_id)`: يبني POC APK باستخدام APKBuilder
- `get_poc_info(scan_id)`: يحصل على معلومات POC

#### تحديثات في `run_scan()`:
- حفظ `scanner` و `decompiler` objects للاستخدام في POC building
- تخزين البيانات اللازمة لبناء exploit APK

### 4. إضافة واجهة POC في Frontend ✅

تم تحديث `/app/frontend/src/pages/ScanPage.jsx`:

#### UI Components:
- قسم جديد "Proof of Concept (POC)" بتصميم gradient purple
- زر "Build POC APK" مع loading state
- زر "Download POC APK" عندما يكون POC جاهز
- أيقونة Bug لتمييز القسم
- رسائل واضحة توضح الغرض من POC

#### Functions:
- `fetchPocStatus()`: جلب حالة POC
- `buildPoc()`: بناء POC مع polling للتحقق من الاكتمال
- `downloadPoc()`: تحميل POC APK

### 5. إعداد Environment Variables ✅

تم إنشاء `/app/backend/.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=qark_db
CORS_ORIGINS=*
ANDROID_SDK_ROOT=/opt/android-sdk
ANDROID_HOME=/opt/android-sdk
```

### 6. إصلاح Dependencies ✅

تم تثبيت:
- `markupsafe` - للتوافق مع jinja2

## ميزات POC الجديدة

### من جهة المستخدم:
1. **سهولة الاستخدام**: زر واحد لبناء POC
2. **معلومات واضحة**: شرح للغرض من POC
3. **حالة مرئية**: مؤشرات لحالة البناء (Building/Ready)
4. **تحميل مباشر**: تحميل APK مباشرة من الواجهة

### من الجهة التقنية:
1. **معالجة في الخلفية**: لا تعطل المستخدم
2. **توافق حديث**: يستخدم أحدث Android SDK APIs
3. **معالجة أخطاء**: try-catch blocks وmessages واضحة
4. **polling آلي**: للتحقق من اكتمال البناء

## كيفية الاستخدام

### للمستخدم:
1. قم برفع وفحص APK file
2. انتظر حتى يكتمل الفحص
3. في صفحة النتائج، ستجد قسم "Proof of Concept (POC)"
4. اضغط على "Build POC APK"
5. انتظر حتى يكتمل البناء (عدة دقائق)
6. اضغط على "Download POC APK" لتحميل الملف
7. قم بتثبيت POC APK على جهاز Android للاختبار

### ما يحتويه POC APK:
- Exploit modules لـ exported components
- Intent sniffer
- Custom intent builder
- File browser للوصول لملفات التطبيق
- WebView tests
- Broadcast receiver exploits
- Tap-jacking demonstrations

## الحالة الحالية

✅ **تم الإنجاز:**
- تحديث كل ملفات Gradle
- إضافة Backend API
- إضافة Frontend UI
- إعداد Environment
- Backend يعمل بنجاح
- Frontend يعمل بنجاح

⚠️ **ملاحظات مهمة:**
1. **Android SDK**: يحتاج POC builder إلى Android SDK مثبت على السيرفر
   - المسار المعرف: `/opt/android-sdk`
   - إذا لم يكن مثبت، سيفشل بناء APK
   
2. **Java**: يحتاج Gradle إلى Java 11+ للعمل

3. **Build Time**: بناء POC APK قد يستغرق 2-5 دقائق حسب حجم التطبيق

## Testing Protocol

### Backend Testing:
```bash
# Test POC build endpoint
curl -X POST http://localhost:8001/api/qark/scan/{scan_id}/build-poc

# Test POC status
curl http://localhost:8001/api/qark/scan/{scan_id}/poc-status

# Test POC download
curl -O http://localhost:8001/api/qark/scan/{scan_id}/download-poc
```

### Frontend Testing:
1. رفع APK file
2. انتظار اكتمال الفحص
3. التحقق من ظهور قسم POC
4. اختبار زر Build POC
5. اختبار زر Download POC

### Integration Testing:
- يجب أن يكون المستخدم قادراً على بناء وتحميل POC بدون أخطاء
- UI يجب أن يعرض حالة صحيحة
- الملف المحمل يجب أن يكون APK صالح

## Deployment Notes

عند الـ deployment على production:
1. تأكد من تثبيت Android SDK
2. تأكد من تثبيت Java 11+
3. قم بإعداد ANDROID_SDK_ROOT في environment variables
4. تأكد من صلاحيات الكتابة في /tmp/qark_output

## Next Steps / Future Enhancements

- [ ] إضافة progress indicator أكثر تفصيلاً لبناء POC
- [ ] إضافة logs viewer لعملية البناء
- [ ] إضافة خيار لتخصيص POC (اختيار exploits محددة)
- [ ] إضافة تعليمات استخدام POC
- [ ] إضافة video توضيحي
