export const warrantyPolicyData = {
  hero: {
    title: "Thông Tin & Chính Sách Bảo Hành",
    subtitle: "Chúng tôi cam kết mang đến dịch vụ hậu mãi tốt nhất, đảm bảo quyền lợi và sự an tâm tuyệt đối cho khách hàng sử dụng sản phẩm chính hãng của SMARTRETAIL.",
    bgImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070",
    cta: [
      { label: "Kiểm tra bảo hành", link: "/", primary: true },
      { label: "Tìm trung tâm hỗ trợ", link: "#support", primary: false }
    ]
  },
  coverage: {
    categories: [
      {
        id: "main",
        label: "Thiết bị chính",
        items: [
          { name: "Màn hình tương tác", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi phần cứng từ nhà sản xuất" },
          { name: "Máy tính OPS", period: "12 Tháng", type: "Sửa chữa", scope: "Lỗi linh kiện, nguồn, bo mạch" },
          { name: "Kiosk tra cứu", period: "24 Tháng", type: "Tại chỗ", scope: "Khung sườn và thiết bị hiển thị" }
        ]
      },
      {
        id: "acc",
        label: "Phụ kiện",
        items: [
          { name: "Bút tương tác", period: "06 Tháng", type: "Đổi mới", scope: "Lỗi cảm ứng, không nhận tín hiệu" },
          { name: "Giá treo/Chân đế", period: "12 Tháng", type: "Thay thế", scope: "Lỗi kết cấu, mối hàn" },
          { name: "Cáp kết nối", period: "03 Tháng", type: "Đổi mới", scope: "Đứt ngầm, không truyền dữ liệu" }
        ]
      },
      {
        id: "parts",
        label: "Linh kiện tiêu hao",
        items: [
          { name: "Pin/Acquy", period: "06 Tháng", type: "Thay thế", scope: "Chai pin > 50%, phồng pin" },
          { name: "Điều khiển (Remote)", period: "06 Tháng", type: "Đổi mới", scope: "Lỗi phím bấm, mắt nhận" }
        ]
      }
    ]
  },
  policies: [
    {
      title: "Điều kiện được bảo hành",
      content: [
        "Sản phẩm còn trong thời hạn bảo hành tính đến thời điểm yêu cầu.",
        "Sản phẩm có số Serial/IMEI trùng khớp với hệ thống quản lý.",
        "Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.",
        "Tem niêm phong của SMARTRETAIL còn nguyên vẹn, không có dấu hiệu tẩy xóa, rách rời."
      ]
    },
    {
      title: "Trường hợp không được bảo hành",
      content: [
        "Sản phẩm hết hạn bảo hành.",
        "Hư hỏng do thiên tai, hỏa hoạn, côn trùng xâm nhập.",
        "Sản phẩm bị biến dạng, nứt vỡ, trầy xước do tác động ngoại lực.",
        "Tự ý tháo gỡ, sửa chữa tại các đơn vị không thuộc ủy quyền của SMARTRETAIL.",
        "Sử dụng sai điện áp hoặc phụ kiện không chính hãng gây cháy nổ."
      ]
    },
    {
      title: "Quy trình xử lý bảo hành",
      content: [
        "Bước 1: Tiếp nhận yêu cầu qua Hotline hoặc Website.",
        "Bước 2: Kiểm tra tình trạng bảo hành online.",
        "Bước 3: Khách hàng gửi thiết bị hoặc kỹ thuật viên đến tận nơi (tùy gói dịch vụ).",
        "Bước 4: Thông báo tình trạng và thời gian xử lý (Thường từ 3-7 ngày làm việc)."
      ]
    }
  ],
  support: [
    { title: "Tổng đài hỗ trợ", desc: "1900 xxxx (8:00 - 17:30)", icon: "PhoneCall", cta: "Gọi ngay" },
    { title: "Chat trực tuyến", desc: "Hỗ trợ kỹ thuật qua Zalo/Facebook", icon: "MessageSquare", cta: "Chat ngay" },
    { title: "Trung tâm bảo hành", desc: "Hệ thống điểm tiếp nhận toàn quốc", icon: "MapPin", cta: "Tìm kiếm" }
  ]
};
