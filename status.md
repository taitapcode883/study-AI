# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## Trạng thái hiện tại
- **Giai đoạn:** 3 – Cài đặt & kiểm thử tự động (F1–F4 xong; tiếp theo F5)
- **URL production:** chưa có

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | ✅ Hoàn thành |
| 2. Thiết kế (Mermaid flowchart) | ✅ Đã duyệt (2026-10-07) |
| 3. Cài đặt & kiểm thử tự động | 🔄 Đang làm |
| 4. Kiểm thử người dùng (UAT) | ⏳ Chưa bắt đầu |
| 5. Triển khai Vercel | ⏳ Chưa bắt đầu |

| Chức năng | Thiết kế | Cài đặt | Unit test | UAT |
|-----------|----------|---------|-----------|-----|
| F1 – Thêm môn học | ✅ | ✅ | ✅ | ☐ |
| F2 – Quy đổi điểm | ✅ | ✅ | ✅ | ☐ |
| F3 – Tính GPA | ✅ | ✅ | ✅ | ☐ |
| F4 – Sửa/xoá môn | ✅ | ✅ | ✅ | ☐ |
| F5 – Lưu dữ liệu | ✅ | ☐ | ☐ | ☐ |

## Quyết định kỹ thuật
| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Quy trình phát triển theo mô hình Waterfall (PRD → thiết kế → cài đặt & test → UAT → deploy) | Theo yêu cầu của anh yêu |
| 2026-10-07 | Vite + HTML/CSS/JS thuần, Vitest, Vercel | Theo PRD mục 3 |
| 2026-10-07 | Tách logic thuần (validation, quy đổi, GPA, storage) khỏi DOM | Để unit test bằng Vitest không cần trình duyệt |
| 2026-10-07 | Flowchart thiết kế đặt trong `docs/flowcharts.md` | Gom tài liệu thiết kế một chỗ |
| 2026-10-07 | Thiết kế được duyệt, gồm cả 6 "Điểm cần anh yêu duyệt" trong `docs/flowcharts.md` | Anh yêu yêu cầu bắt đầu cài đặt |
| 2026-10-07 | Logic thuần đặt trong `src/logic/` (test cạnh file: `*.test.js`), giao diện trong `src/main.js` | Tách logic khỏi DOM để test bằng Vitest |
| 2026-10-07 | Ô Số tín chỉ và Điểm dùng `type="text"` (kèm `inputmode`) thay vì `type="number"` | `type="number"` không nhận "8,5" trên một số trình duyệt; validation do ứng dụng tự làm |
| 2026-10-07 | Làm tròn điểm bằng ký pháp mũ (`8.45e1`) thay vì `x * 10` | Tránh sai số dấu phẩy động (8.45 * 10 = 84.4999… → 8.4 sai) |
| 2026-10-07 | Bảng quy đổi F2 là mảng `GRADE_SCALE` (mốc dưới, giảm dần) trong `src/logic/grading.js`; `convertGrade` tự làm tròn 1 chữ số trước khi so mốc | Một nguồn dữ liệu cho cả F2 và F3; an toàn kể cả khi nhận điểm chưa làm tròn |
| 2026-10-07 | F3: `summarize` trong `src/logic/gpa.js` trả GPA/xếp loại `null` khi rỗng (giao diện hiện "—"); số môn/tín chỉ hiện 0 như flowchart F3. Làm tròn 2 chữ số bằng ký pháp mũ | Giữ logic thuần, tránh sai số dấu phẩy động |
| 2026-10-07 | F4: `updateCourse`/`removeCourse` trong `src/logic/courses.js`; giao diện giữ `editingId`, nút Sửa/Xoá dùng event delegation trên `tbody`, xác nhận bằng `window.confirm`; dòng đang sửa được tô nền và tiêu đề form đổi thành "Sửa môn học" | Theo flowchart F4 và điểm duyệt số 3, 6 |
| 2026-10-07 | Mỗi chức năng làm trên một nhánh riêng từ `main`, chỉ merge khi test pass và build thành công | Theo yêu cầu của anh yêu (ghi trong `CLAUDE.md`) |

## Thay đổi so với ban đầu
| Ngày | Thay đổi | Lý do | Ảnh hưởng |
|------|----------|-------|-----------|
| 2026-10-07 | Khởi tạo lại lịch sử git, repo chuyển sang `taitapcode883/study-AI` | Bắt đầu dự án mới từ template | Mất 2 commit cũ (PRD) trong lịch sử; nội dung PRD giữ nguyên |

## Lỗi / góp ý từ UAT
_Chưa có._
