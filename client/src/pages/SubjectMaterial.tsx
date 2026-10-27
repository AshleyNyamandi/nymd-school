import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";


import LoadingPage from "../components/Loading";
import FetchErrorCard from "../components/FetchError";
import MaterialCard from "../components/MaterialCard";
import api from "../services/api";

const SubjectMaterial = () => {
    const { level, subject, year } = useParams();
    console.log(year)

    const fetchSubjectMaterial = async() => {
        const response = await api.get(`/subjects/subject/level/${level}/subject/${subject}/year/${year}`, {
            params: {
                type: ["marking-scheme", "past-paper"]
            }
        });
        return response.data.data || []
    }

    const {  data, error, isLoading, isPending } = useQuery({
        queryKey: ["subjectMaterial", level, subject, year], 
        queryFn: fetchSubjectMaterial
    })

    // Show spinner while loading
    if (isLoading || isPending) {
        return (
            <LoadingPage />
        )
    }

    if (error) {
        return (
            <FetchErrorCard />
        )}
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <MaterialCard 
                data={data}
            />
        </div>

    )
}

export default SubjectMaterial;