import api from "./api";

export const getOfficers = async () => {
    const response = await api.get("/users/officers", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.data;
}