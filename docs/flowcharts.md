# Thiết kế luồng nghiệp vụ – GPA Tracker

Tài liệu giai đoạn 2 (Waterfall). Mỗi sơ đồ bám theo `PRD.md`; chỗ nào PRD chưa nói rõ thì được ghi ở mục **Điểm cần anh yêu duyệt** cuối tài liệu.

## 0. Luồng tổng thể của ứng dụng

```mermaid
flowchart TD
    A([Mở trang]) --> B["Đọc localStorage<br/>key 'gpa-tracker:v1' (F5)"]
    B --> C{Dữ liệu đọc được<br/>và hợp lệ?}
    C -- Có --> D[Danh sách môn = dữ liệu đã lưu]
    C -- "Không / chưa có" --> E[Danh sách môn = rỗng]
    D --> F["Hiển thị bảng môn học<br/>(mỗi dòng có điểm chữ, hệ 4 - F2)"]
    E --> F
    F --> G["Tính và hiển thị tổng kết (F3)"]
    G --> H[/Chờ thao tác của người dùng/]
    H -- "Thêm môn" --> I[F1 – Thêm môn học]
    H -- "Sửa / Lưu" --> J[F4 – Sửa môn học]
    H -- "Xoá" --> K[F4 – Xoá môn học]
    H -- "Xoá tất cả" --> L[F5 – Xoá tất cả]
    I --> M{Danh sách<br/>có thay đổi?}
    J --> M
    K --> M
    L --> M
    M -- Có --> N["Lưu danh sách vào localStorage (F5)"]
    N --> F
    M -- Không --> H
```

## 1. F1 – Thêm môn học

```mermaid
flowchart TD
    A([Người dùng nhập Tên môn,<br/>Số tín chỉ, Điểm hệ 10]) --> B["Nhấn 'Thêm môn' hoặc Enter"]
    B --> C[Xoá các thông báo lỗi cũ]
    C --> D[Kiểm tra Tên môn<br/>sau khi bỏ khoảng trắng 2 đầu]
    D --> D1{Rỗng?}
    D1 -- Có --> D2["Lỗi dưới ô Tên môn:<br/>'Vui lòng nhập tên môn'"]
    D1 -- Không --> D3{Dài hơn 100 ký tự?}
    D3 -- Có --> D4["Lỗi: 'Tên môn tối đa 100 ký tự'"]
    D3 -- Không --> D5[Tên môn hợp lệ]

    D2 --> E
    D4 --> E
    D5 --> E
    E{Số tín chỉ là<br/>số nguyên từ 1 đến 10?}
    E -- Không --> E1["Lỗi dưới ô Số tín chỉ:<br/>'Số tín chỉ phải là số nguyên từ 1 đến 10'"]
    E -- Có --> E2[Số tín chỉ hợp lệ]

    E1 --> F
    E2 --> F
    F["Chuẩn hoá điểm:<br/>đổi dấu phẩy ',' thành dấu chấm '.'"] --> F1{Là số<br/>từ 0 đến 10?}
    F1 -- Không --> F2["Lỗi dưới ô Điểm:<br/>'Điểm phải là số từ 0 đến 10'"]
    F1 -- Có --> F3[Làm tròn 1 chữ số thập phân<br/>vd. 8,45 → 8.5]

    F2 --> G
    F3 --> G
    G{Cả 3 ô<br/>đều hợp lệ?}
    G -- Không --> G1[Giữ nguyên dữ liệu trên form,<br/>hiển thị các lỗi dưới từng ô]
    G1 --> A
    G -- Có --> H["Tạo môn học mới<br/>(id, tên, tín chỉ, điểm hệ 10)"]
    H --> I[Thêm vào cuối danh sách]
    I --> J["Lưu localStorage (F5)"]
    J --> K["Vẽ lại bảng (F2) và tổng kết (F3)"]
    K --> L[Xoá trắng form,<br/>đặt con trỏ vào ô Tên môn]
    L --> Z([Kết thúc])
```

> Cả 3 ô được kiểm tra trong một lần nhấn, nên người dùng thấy **tất cả** lỗi cùng lúc thay vì sửa từng lỗi một.

## 2. F2 – Quy đổi điểm

Đầu vào là điểm hệ 10 **đã làm tròn 1 chữ số** (bước F3 của F1), nên không có giá trị rơi vào khe giữa các mốc (vd. 8.45 đã thành 8.5).

```mermaid
flowchart TD
    A([Điểm hệ 10 đã làm tròn 1 chữ số]) --> B{"≥ 8.5?"}
    B -- Có --> RA["A – 4.0"]
    B -- Không --> C{"≥ 8.0?"}
    C -- Có --> RBp["B+ – 3.5"]
    C -- Không --> D{"≥ 7.0?"}
    D -- Có --> RB["B – 3.0"]
    D -- Không --> E{"≥ 6.5?"}
    E -- Có --> RCp["C+ – 2.5"]
    E -- Không --> F{"≥ 5.5?"}
    F -- Có --> RC["C – 2.0"]
    F -- Không --> G{"≥ 5.0?"}
    G -- Có --> RDp["D+ – 1.5"]
    G -- Không --> H{"≥ 4.0?"}
    H -- Có --> RD["D – 1.0"]
    H -- Không --> RF["F – 0.0"]
    RA & RBp & RB & RCp & RC & RDp & RD & RF --> Z([Trả về điểm chữ và điểm hệ 4,<br/>hiển thị trên dòng của môn])
```

## 3. F3 – Tính GPA và xếp loại

```mermaid
flowchart TD
    A([Danh sách môn thay đổi<br/>hoặc trang vừa tải]) --> B{Danh sách rỗng?}
    B -- Có --> B1["Tổng số môn = 0, tổng tín chỉ = 0, tín chỉ đạt = 0<br/>GPA hệ 4, GPA hệ 10, Xếp loại = '—'"]
    B1 --> B2["Hiện dòng hướng dẫn<br/>'Hãy thêm môn học đầu tiên'"]
    B2 --> Z([Kết thúc])
    B -- Không --> C["Với mỗi môn: lấy điểm hệ 4 (F2)"]
    C --> D["Tổng tín chỉ = Σ tín chỉ<br/>Tín chỉ đạt = Σ tín chỉ của môn có điểm hệ 10 ≥ 4.0"]
    D --> E["GPA hệ 4 = Σ(hệ 4 × tín chỉ) / Σ tín chỉ<br/>GPA hệ 10 = Σ(hệ 10 × tín chỉ) / Σ tín chỉ"]
    E --> F[Làm tròn cả 2 GPA đến 2 chữ số thập phân]
    F --> G{"GPA hệ 4 ≥ 3.6?"}
    G -- Có --> X1[Xuất sắc]
    G -- Không --> H{"≥ 3.2?"}
    H -- Có --> X2[Giỏi]
    H -- Không --> I{"≥ 2.5?"}
    I -- Có --> X3[Khá]
    I -- Không --> J{"≥ 2.0?"}
    J -- Có --> X4[Trung bình]
    J -- Không --> X5[Yếu]
    X1 & X2 & X3 & X4 & X5 --> K["Hiển thị: tổng số môn, tổng tín chỉ, tín chỉ đạt,<br/>GPA hệ 4, GPA hệ 10, xếp loại<br/>(ẩn dòng hướng dẫn)"]
    K --> Z
```

> Xếp loại dùng GPA hệ 4 **đã làm tròn** 2 chữ số (đúng với con số người dùng nhìn thấy).

## 4. F4 – Sửa và xoá môn học

### 4a. Sửa môn

```mermaid
flowchart TD
    A([Nhấn 'Sửa' trên một dòng]) --> B[Ghi nhớ id môn đang sửa]
    B --> C[Đưa Tên môn, Số tín chỉ, Điểm lên form]
    C --> D["Đổi nút 'Thêm môn' thành 'Lưu'"]
    D --> E[/Người dùng chỉnh dữ liệu,<br/>nhấn 'Lưu' hoặc Enter/]
    E --> F["Kiểm tra dữ liệu<br/>(cùng quy tắc với F1)"]
    F --> G{Hợp lệ?}
    G -- Không --> G1[Hiển thị lỗi dưới từng ô,<br/>vẫn ở chế độ sửa]
    G1 --> E
    G -- Có --> H[Thay môn có id đang sửa<br/>bằng dữ liệu mới, giữ nguyên vị trí]
    H --> I["Lưu localStorage (F5)"]
    I --> J["Vẽ lại bảng (F2) và tổng kết (F3)"]
    J --> K["Xoá trắng form, nút trở lại 'Thêm môn',<br/>đặt con trỏ vào ô Tên môn"]
    K --> Z([Kết thúc])
```

### 4b. Xoá môn

```mermaid
flowchart TD
    A([Nhấn 'Xoá' trên một dòng]) --> B["Hộp xác nhận:<br/>'Xoá môn [tên môn]?'"]
    B --> C{Người dùng<br/>đồng ý?}
    C -- Không --> Z([Không thay đổi gì])
    C -- Có --> D[Xoá môn khỏi danh sách]
    D --> E{Môn này đang<br/>được sửa trên form?}
    E -- Có --> E1["Thoát chế độ sửa:<br/>xoá trắng form, nút về 'Thêm môn'"]
    E -- Không --> F
    E1 --> F["Lưu localStorage (F5)"]
    F --> G["Vẽ lại bảng (F2) và tổng kết (F3)"]
    G --> Z2([Kết thúc])
```

## 5. F5 – Lưu dữ liệu

### 5a. Tải dữ liệu khi mở trang

```mermaid
flowchart TD
    A([Mở / tải lại trang]) --> B["Đọc localStorage 'gpa-tracker:v1'"]
    B --> C{Đọc được?<br/>localStorage khả dụng}
    C -- Không --> R[Danh sách rỗng]
    C -- Có --> D{Có dữ liệu?}
    D -- Không --> R
    D -- Có --> E{JSON.parse<br/>thành công?}
    E -- Không --> R
    E -- Có --> F{Là mảng?}
    F -- Không --> R
    F -- Có --> G["Giữ lại các phần tử hợp lệ<br/>(tên, tín chỉ, điểm đúng quy tắc F1),<br/>bỏ qua phần tử hỏng"]
    G --> H[Danh sách = các môn hợp lệ]
    R --> Z(["Hiển thị trang bình thường<br/>(không báo lỗi, không trắng trang)"])
    H --> Z
```

### 5b. Lưu khi có thay đổi

```mermaid
flowchart TD
    A([Thêm / Sửa / Xoá / Xoá tất cả<br/>thành công]) --> B["JSON.stringify(danh sách)"]
    B --> C["Ghi vào localStorage 'gpa-tracker:v1'"]
    C --> D{Ghi thành công?}
    D -- Có --> Z([Kết thúc])
    D -- "Không (bị chặn / đầy bộ nhớ)" --> E["Bỏ qua lỗi, ứng dụng vẫn chạy<br/>(dữ liệu chỉ còn trong phiên hiện tại)"]
    E --> Z
```

### 5c. Xoá tất cả

```mermaid
flowchart TD
    A([Nhấn 'Xoá tất cả']) --> B{Danh sách rỗng?}
    B -- Có --> Z0([Không làm gì])
    B -- Không --> C["Hộp xác nhận:<br/>'Xoá tất cả môn học? Không thể hoàn tác.'"]
    C --> D{Người dùng<br/>đồng ý?}
    D -- Không --> Z0
    D -- Có --> E[Danh sách = rỗng]
    E --> F["Thoát chế độ sửa nếu đang sửa,<br/>xoá trắng form"]
    F --> G["Lưu danh sách rỗng vào localStorage"]
    G --> H["Vẽ lại: bảng trống, tổng kết '—',<br/>hiện 'Hãy thêm môn học đầu tiên' (F3)"]
    H --> Z([Kết thúc])
```

## Điểm cần anh yêu duyệt

Những chỗ PRD chưa quy định rõ, sơ đồ trên đang chọn như sau:

1. **Kiểm tra cả 3 ô cùng lúc** khi nhấn Thêm/Lưu và hiện mọi lỗi một lượt (F1).
2. **Xếp loại dựa trên GPA hệ 4 đã làm tròn** 2 chữ số (F3).
3. **Không có nút "Huỷ" khi sửa** (PRD không yêu cầu). Nếu xoá chính môn đang sửa hoặc "Xoá tất cả" thì form tự thoát chế độ sửa (F4, F5).
4. **Dữ liệu lưu bị hỏng một phần:** giữ các môn hợp lệ, bỏ các phần tử hỏng. Hỏng toàn bộ thì về danh sách rỗng (F5).
5. **"Xoá tất cả" khi danh sách đang rỗng:** không làm gì, không hỏi xác nhận (F5).
6. **Hộp xác nhận** dùng `window.confirm` của trình duyệt cho đơn giản.
