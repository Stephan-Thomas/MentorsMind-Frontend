import { request } from "./request";

export default class MentorService {
  async getMentors() {
    return request<{ id: string; name: string }[]>(
      {
        method: "GET",
        url: "/mentors",
      },
      true,
    );
  }

  async getMentor(id: string) {
    return request<{ id: string; name: string }[]>(
      {
        method: "GET",
        url: "/mentors",
        data: { id },
      },
      true,
    );
  }
  
  async add(args: Record<string, unknown>) {
    return request<{ id: string; name: string }[]>({
      method: "POST",
      url: "/mentors",
      data: { args },
    });
  }
}
